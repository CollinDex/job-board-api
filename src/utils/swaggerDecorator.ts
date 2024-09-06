export function SwaggerDoc(docComment: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    Reflect.defineMetadata("swaggerDoc", docComment, target, propertyKey);

    return descriptor;
  };
}
