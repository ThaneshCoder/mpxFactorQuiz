export async function getResultsByUserId(req, res, next) {
  try {
    
    res.status(200).json("results");
  } catch (err) {
    next(err);
  }
}
