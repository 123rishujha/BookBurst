import { slice } from "../../../redux/slice/slice";

const authSlice = slice.injectEndpoints({
  endpoints: (builder) => ({
    bookUserOperations: builder.mutation({
      query: ({ body, method, url, msz }) => ({
        url: `api/book${url ? url : ""}`,
        body: body,
        method: method,
        msz: msz ?? true,
      }),
      invalidatesTags: ["user-books"],
    }),
    getUserbooks: builder.query({
      query: (args) => ({
        url: `api/book${args ? args : ""}`,
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["user-books"],
    }),
    getUserbooks: builder.query({
      query: (args) => ({
        url: `api/book${args ? args : ""}`,
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["user-books"],
    }),
    getPublicBooks: builder.query({
      query: (args) => ({
        url: `api/book/public-books${args ? args : ""}`,
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["user-books"],
    }),
  }),
});

export const {
  useGetUserbooksQuery,
  useGetPublicBooksQuery,
  useBookUserOperationsMutation,
} = authSlice;
