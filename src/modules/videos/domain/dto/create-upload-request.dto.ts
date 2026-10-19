export interface CreateUploadRequestDto {
  title: string
  description: string
  genreIds: string[]
  contentType: string
  sizeBytes: number
}
