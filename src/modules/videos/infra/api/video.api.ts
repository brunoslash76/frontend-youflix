import { api } from "@/shared/store/api";
import type { CompleteUploadResponseDto } from "../../domain/dto/complete-upload-response.dto";
import type { CreateThumbnailResponseDto } from "../../domain/dto/create-thumbnail-response.dto";
import type { CreateThumbnailUploadDto } from "../../domain/dto/create-thumbnail-upload.dto";
import type { CreateUploadRequestDto } from "../../domain/dto/create-upload-request.dto";
import type { CreateUploadResponseDto } from "../../domain/dto/create-upload-response.dto";
import type { HomeFeed } from "../../domain/dto/home-feed.dto";
import type { VideoDetailResponseDto } from "../../domain/dto/video-detail-response.dto";
import type { GenreEntity } from "../../domain/entity/genre.entity";
import type { VideoDetailEntity } from "../../domain/entity/video-detail.entity";
import type { GetHomeFeedArgs } from "../../domain/types/get-feed-args.type";

export const videoApi = api
  .enhanceEndpoints({ addTagTypes: ['Feed', 'Genre', 'Video'] })
  .injectEndpoints({
    endpoints: (build) => ({
      // ** Get Home Feed **
      getHomeFeed: build.query<HomeFeed, GetHomeFeedArgs>({
        query: ({ page = 1, limit = 20 }) => ({
          url: '/video/feed',
          params: { page, limit },
        }),
        providesTags: ['Feed']
      }),
      // ** Get Genres **
      getGenres: build.query<GenreEntity[], void>({
        query: () => '/genre/all',
        providesTags: ['Genre']
      }),
      // **  Get Video **
      getVideo: build.query<VideoDetailEntity, string>({
        query: (publicId) => `/video/${publicId}`,
        providesTags: (_result, _error, publicId) => [{ type: 'Video' as const, id: publicId }]
      }),
      // ** Create Upload **
      createUpload: build.mutation<CreateUploadResponseDto, CreateUploadRequestDto>({
        query: (body) => ({ url: 'video/upload', method: 'POST', body }),
      }),
      // **  Complete Upload **
      completeUpload: build.mutation<CompleteUploadResponseDto, string>({
        query: (publicId) => ({
          url: `/video/${publicId}/complete`,
          method: 'POST',
        }),
        invalidatesTags: ['Feed']
      }),
      // ** Upload Thumbnail **
      createThumbnailUpload: build.mutation<CreateThumbnailResponseDto, CreateThumbnailUploadDto>({
        query: ({ publicId, ...body }) => ({
          url: `/video/${publicId}/thumbnail/upload-url`,
          method: 'POST',
          body,
        }),
      }),
      updateVideoDetails: build.mutation<VideoDetailEntity, VideoDetailResponseDto>({
        query: ({ publicId, ...body }) => ({ url: `/video/${publicId}`, method: 'PATCH', body }),
        invalidatesTags: (_r, _e, { publicId }) => ['Feed', { type: 'Video' as const, id: publicId }],
      }),
    }),
  })

export const {
  useGetHomeFeedQuery,
  useGetGenresQuery,
  useGetVideoQuery,
  useLazyGetVideoQuery,
  useCreateUploadMutation,
  useCompleteUploadMutation,
  usePrefetch,
  useCreateThumbnailUploadMutation,
  useUpdateVideoDetailsMutation,
} = videoApi;