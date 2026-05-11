export const register = async (req, res) => {
  res.status(201).json({
    success: true,
    message: "Register controller working"
  });
};


export const login = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Login controller working"
  });
};
