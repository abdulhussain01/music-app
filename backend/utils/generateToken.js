export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJWTToken();

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message,
      token,
    });
};
