import authService from "../services/auth.service.js"
import { OK, CREATED } from "../handler/success-response.js"
import { AuthFailureError } from "../handler/error-response.js"

class AuthController {
  register = async (req, res) => {
    const result = await authService.register(req.body)
    res.status(201).json(new CREATED({
      message: "User registered successfully",
      metadata: {
        user: result.user      
      }
    }))
  }

    oauthCallback = async (req, res) => {
      const user = req.user;

      const result = await authService._createToken(user);

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json(new OK({
        message: "OAuth2 login successful",
        metadata: {
          accessToken: result.accessToken,
          user: result.user
        }
      }));
    }

  login = async (req, res) => {
    const { email, password } = req.body
    const result = await authService.login(email, password)
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json(new OK({
      message: "Login successful",
      metadata: {
        accessToken: result.accessToken,
        user: result.user
      }
    }))
  }

  refreshToken = async (req, res) => {
    const token = req.cookies.accessToken
    if (!token) {
      throw new AuthFailureError("Access token is required", 401)
    }

    const result = await authService.refreshToken(token)
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json(new OK({
      message: "Token refreshed successfully",
      metadata: {
        accessToken: result.accessToken,
        user: result.user
      }
    }))
  }

  logout = async (req, res) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "Strict"
    })
    res.status(200).json(new OK({
      message: "Logout successful",
      metadata: {}
    }))
  }

  sendOtp = async (req, res) => {
    const { email } = req.body
    const result = await authService.sendOtp(email)
    res.status(200).json(new OK({
      message: "OTP sent successfully",
      metadata: {
        otpExpire: result.otpExpire
      }
    }))
  }

  verifyOtp = async (req, res) => {
    const { email, otp } = req.body
    await authService.verifyOtp(email, otp)
    res.status(200).json(new OK({
      message: "OTP verified successfully"
    }))
  }

  resetPassword = async (req, res) => {
    const { email, newPassword } = req.body
    await authService.resetPassword(email, newPassword)
    res.status(200).json(new OK({
      message: "Password reset successfully"
    }))
  }
}

export default new AuthController()