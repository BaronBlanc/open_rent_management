import pytest
from unittest import mock
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from app.core.auth import get_auth_service, get_current_active_user
from app.models.user import User
from app.services.authentication_service import AuthenticationService


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

    with mock.patch.object(auth_service, "get_current_active_user", return_value=user):
        result = get_current_active_user(token, auth_service)
        assert result == user
