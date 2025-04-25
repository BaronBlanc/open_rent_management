export interface BearerToken {
    token: string;
    refreshToken: string;
    type: string;
}

export interface UserTokenInformation extends BearerToken {
    userId: string;
}