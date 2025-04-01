import HttpService from "./http.service";

class AuthService {
  login = async (payload: any) => {
    const loginEndpoint = "login";
    return await HttpService.post(loginEndpoint, payload);
  };

  register = async (credentials: any) => {
    const registerEndpoint = "/user/create";
    return await HttpService.post(registerEndpoint, credentials);
  };

  logout = async () => {
    const logoutEndpoint = "logout";
    return await HttpService.post(logoutEndpoint);
  };

  forgotPassword = async (payload: any) => {
    const forgotPassword = "password-forgot";
    return await HttpService.post(forgotPassword, payload);
  };

  resetPassword = async (credentials: any) => {
    const resetPassword = "password-reset";
    return await HttpService.post(resetPassword, credentials);
  };

  getProfile = async () => {
    const getProfile = "me";
    return await HttpService.get(getProfile);
  };

  updateProfile = async (newInfo: any) => {
    const updateProfile = "me";
    return await HttpService.patch(updateProfile, newInfo);
  };
}

export default new AuthService();
