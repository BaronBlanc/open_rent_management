from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.auth import get_auth_service, get_current_active_user, get_http_auth_exception, get_user_service
from app.core.dependencies import get_db
from app.models.auth_errors import AuthError
from app.models.user import User
from app.schemas.token import RefreshToken, Token
from app.schemas.user_create import UserCreate
from app.schemas.user_response import UserResponse
from app.services.authentication_service import AuthenticationService
from sqlalchemy.orm import Session

from app.services.user_service import UserService

db = Depends(get_db)

router = APIRouter()


@router.post("/token", response_model=RefreshToken)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthenticationService = Depends(get_auth_service),
) -> Token:
    try:
        user = auth_service.authenticate_user(form_data.username, form_data.password)
        if not user:
            raise get_http_auth_exception(
                status_code=status.HTTP_401_UNAUTHORIZED, message=AuthError.INVALID_CREDENTIALS
            )
        return auth_service.login(user.email)
    except Exception as e:
        raise get_http_auth_exception(status_code=status.HTTP_401_UNAUTHORIZED, message=str(e))


@router.post("/refresh", response_model=RefreshToken)
async def refresh_access_token(
    refresh_token: str, auth_service: AuthenticationService = Depends(get_auth_service)
) -> RefreshToken:
    try:
        return auth_service.refresh_access_token(refresh_token)
    except Exception as e:
        raise get_http_auth_exception(status_code=status.HTTP_401_UNAUTHORIZED, message=str(e))


@router.post("/register")
async def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_active_user),
) -> UserResponse:
    try:
        return user_service.register_user(user_in)
    except Exception as e:
        raise get_http_auth_exception(status_code=status.HTTP_400_BAD_REQUEST, message=str(e))


@router.post("/logout")
async def logout(refresh_token: str, auth_service: AuthenticationService = Depends(get_auth_service)):
    return HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Logout is not implemented")


@router.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user
