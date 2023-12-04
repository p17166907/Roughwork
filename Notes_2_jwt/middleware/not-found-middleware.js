const notFound = (req, res) => res.status(404).send(`<h1>${res.statusCode} page Not Found</h1>`)

module.exports = notFound
