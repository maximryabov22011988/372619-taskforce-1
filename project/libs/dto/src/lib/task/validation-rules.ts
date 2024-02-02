export enum TaskValidationRule {
  TitleMinLength = 20,
  TitleMaxLength = 50,
  DescriptionMinLength = 100,
  DescriptionMaxLength = 1024,
  AddressMinLength = 10,
  AddressMaxLength = 255,
  TagMinLength = 3,
  TagMaxLength = 10,
}

export enum CommentValidationRule {
  TextMinLength = 10,
  TextMaxLength = 300,
}

export enum ReviewRule {
  TextMinLength = 50,
  TextMaxLength = 500,
  MinRating = 1,
  MaxRating = 5,
}
