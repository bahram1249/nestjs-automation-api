get all controller with name \*.controller.ts inside : apps\e-commerce
for those controller that have : @UseInterceptors(JsonResponseTransformInterceptor)
like controller apps\core\src\admin\menu\menu.controller.ts
we must generate produce related schema with @ApiJsonResponse , so we must create output response schema dto for all api expose from that controller
but it most important you reading belonged service of that controller.
cuase we generate a output using sequelize. and some result have included model , so that model also must be showing in response
please reading the structure of query builder libs\query-filter\src\sequelize-query-builder to make strong model for all controller that mentioned
