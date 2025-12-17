export interface UserModel {
    id: string;
    username: string;
    email: string;
    mpAccountConnected?: boolean; // Debe coincidir con el JSON del backend
}