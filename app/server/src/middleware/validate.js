export function validate(schema, property = 'body') {
  return (req, _res, next) => {
    req[property] = schema.parse(req[property]);
    next();
  };
}
