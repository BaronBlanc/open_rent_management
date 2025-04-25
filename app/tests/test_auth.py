import pytest
from unittest import mock
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from app.core.auth import get_auth_service, get_current_active_user
from app.models.user import User
from app.services.authentication_service import AuthenticationService
from fastapi import HTTPException, Request
from app.core.auth import get_token


# Mock dependencies
@pytest.fixture
def db_session():
    return mock.Mock(spec=Session)


@pytest.fixture
def oauth2_scheme():
    return mock.Mock(spec=OAuth2PasswordBearer)


@pytest.fixture
def auth_service(db_session, oauth2_scheme):
    return AuthenticationService(oauth2_scheme, db_session)


def test_get_auth_service(db_session):
    auth_service = get_auth_service(db_session)
    assert isinstance(auth_service, AuthenticationService)


def test_get_current_active_user(db_session, auth_service):
    token = "test_token"
    user = User(id=1, email="test@example.com")
    request = mock.Mock()
    request.headers = {"Authorization": f"Bearer {token}"}
    with mock.patch.object(auth_service, "get_current_active_user", return_value=user):
        result = get_current_active_user(request, token, auth_service)
        assert result == user


def test_get_token_from_authorization_header():
    request = mock.Mock(spec=Request)
    request.headers = {"Authorization": "Bearer test_token"}
    request.cookies = {}

    token = get_token(request)
    assert token == "test_token"


def test_get_token_from_cookies():
    request = mock.Mock(spec=Request)
    request.headers = {}
    request.cookies = {"accessToken": "test_token"}
    token = get_token(request)
    assert token == "test_token"


def test_get_token_missing_token():
    request = mock.Mock(spec=Request)
    request.headers = {}
    request.cookies = {}
    with pytest.raises(HTTPException) as exc_info:
        get_token(request)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Access token is missing"
    assert exc_info.value.headers is not None and exc_info.value.headers["WWW-Authenticate"] == "Bearer"
