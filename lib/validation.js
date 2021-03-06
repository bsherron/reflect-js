const Joi = require('joi')
const R = require('ramda')
const { findModelsByName } = require('./querybuilder/utils.js')

function validateQueryString(models, relationships, resource, query) {
  const modelFinder = findModelsByName(models)
  const model = modelFinder(resource)
  const columns = R.map((item) => item.name, model.columns)
  const related = R.filter(item => item, R.map((item) => item.relatedTo, R.filter(
    (item) => item.resource === resource,
    relationships
  )))
  const through = R.filter(item => item, R.map((item) => item.through, R.filter(
    (item) => item.resource === resource,
    relationships
  )))
  const relatedColumns = R.flatten(R.map((item) => {
    const relatedModel = modelFinder(item)
    return R.map(col => col.name, relatedModel.columns)
  }, related))
  const queryString = query

  const whereOperatorSchema = R.mergeAll(R.map(
    (item) => R.objOf(item, Joi.any()),
    [
      "$gt",
      "$gte",
      "$lt",
      "$lte",
      "$ne",
      "$eq",
      "$between",
      "$notBetween",
      "$in",
      "$notIn",
      "$like",
      "$notLike"
    ]
  ))
  const whereColumnSchema = R.mergeAll(
    R.map(
      (item) => R.objOf(item, whereOperatorSchema),
      columns
    )
  )
  const whereRelatedColumnSchema = R.mergeAll(
    R.map(
      (item) => R.objOf(item, whereOperatorSchema),
      relatedColumns
    )
  )

  const schema = Joi.object().keys({
    limit: Joi.number(),
    offset: Joi.number().positive(),
    page: Joi.number().positive(),
    per_page: Joi.number().positive(),
    // Validate that where query is properly formed
    where: Joi.object(whereColumnSchema),
    orderby: Joi.string().valid(columns),
    order: Joi.string().valid('asc', 'desc').insensitive(),
    groupby: Joi.string().valid(columns),
    distinct: Joi.string().valid(columns),
    attributes: Joi.array().items(Joi.string().valid(columns)),
    includes: Joi.array().items(
      Joi.object().keys({
        resource: Joi.string().valid(related),
        where: Joi.object(whereRelatedColumnSchema),
        attributes: Joi.array(),
        through: Joi.string().valid(through),
      })
    ),
  })
  .with('offset', ['limit', 'order', 'orderby'])
  .with('page', ['per_page', 'order', 'orderby'])
  .with('order', ['orderby'])
  .with('orderby', ['order'])

  return Joi.validate(queryString, schema)
}

module.exports = {
  validateQueryString
}
