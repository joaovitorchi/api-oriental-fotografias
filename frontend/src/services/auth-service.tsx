import HttpService from "./http.service";

class AuthService {
  login = async (payload: any) => {
    const loginEndpoint = "login";
    try {
      const response = await HttpService.post(loginEndpoint, payload);
      return response;
    } catch (error: any) {
      // Se o erro já estiver estruturado e contiver .errors ou .message, relança conforme.
      if (error?.errors && Array.isArray(error.errors)) {
        throw { errors: error.errors };
      } else if (error?.message) {
        throw { message: error.message };
      } else {
        throw { message: "Erro inesperado ao fazer login." };
      }
    }
  };

  register = async (credentials: any) => {
    const registerEndpoint = "/user/create";
    try {
      const response = await HttpService.post(registerEndpoint, credentials);
      return response;
    } catch (error: any) {
      if (error?.errors && Array.isArray(error.errors)) {
        throw { errors: error.errors };
      } else if (error?.message) {
        throw { message: error.message };
      } else {
        throw { message: "Erro inesperado ao fazer o cadastro." };
      }
    }
  };

  logout = async () => {
    const logoutEndpoint = "logout";
    try {
      return await HttpService.post(logoutEndpoint);
    } catch (error: any) {
      throw { message: "Erro inesperado ao fazer logout." };
    }
  };

  forgotPassword = async (payload: any) => {
    const forgotPassword = "password-forgot";
    try {
      return await HttpService.post(forgotPassword, payload);
    } catch (error: any) {
      throw { message: "Erro inesperado ao solicitar recuperação de senha." };
    }
  };

  resetPassword = async (credentials: any) => {
    const resetPassword = "password-reset";
    try {
      return await HttpService.post(resetPassword, credentials);
    } catch (error: any) {
      throw { message: "Erro inesperado ao resetar a senha." };
    }
  };

  getProfile = async () => {
    const getProfile = "me";
    try {
      return await HttpService.get(getProfile);
    } catch (error: any) {
      throw { message: "Erro inesperado ao buscar o perfil." };
    }
  };

  updateProfile = async (newInfo: any) => {
    const updateProfile = "me";
    try {
      return await HttpService.patch(updateProfile, newInfo);
    } catch (error: any) {
      throw { message: "Erro inesperado ao atualizar o perfil." };
    }
  };
}

export default new AuthService();
