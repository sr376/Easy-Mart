const sendToken = async (user, statusCode, res) => {
  // generate token
  const token = await user.getJWTToken();

  // expires
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

export default sendToken;
