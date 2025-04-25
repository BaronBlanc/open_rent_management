from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models.user import User
from app.services.authentication_service import AuthenticationService
from app.services.user_service import UserService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/token")


# Custom dependency to retrieve the token from either the Authorization header or cookies
def get_token(request: Request) -> str:
    # Check the Authorization header first
    authorization: str = request.headers.get("Authorization", "")
    if authorization and authorization.startswith("Bearer "):
        return authorization.split(" ")[1]  # Extract the token after "Bearer"

    # Fallback to checking cookies
    token = request.cookies.get("accessToken", "")
    if token:
        return token

    # If no token is found, raise an exception
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Access token is missing",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_auth_service(db: Session = Depends(get_db)):
    return AuthenticationService(oauth2_scheme, db)


def get_user_service(db: Session = Depends(get_db), auth_service: AuthenticationService = Depends(get_auth_service)):
    return UserService(db, auth_service)


def get_current_active_user(
    request: Request, token: str = Depends(get_token), auth_service: AuthenticationService = Depends(get_auth_service)
) -> User:
    try:
        return auth_service.get_current_active_user(token)
    except Exception as e:
        raise get_http_auth_exception(status_code=status.HTTP_401_UNAUTHORIZED, message=str(e))


def get_http_auth_exception(status_code: int, message: str):
    return HTTPException(
        status_code=status_code,
        detail=message,
        headers={"WWW-Authenticate": "Bearer"},
    )
