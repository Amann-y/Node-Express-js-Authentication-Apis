const testController = async (req, res) => {
  try {
    res.status(200).send({
      message: "Test Routes",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export { testController };
