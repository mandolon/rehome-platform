// Storybook stub for next/navigation used by components like Protected
export const useRouter = () => ({
  push: (_path: string) => {},
  prefetch: async (_path: string) => {},
  replace: (_path: string) => {},
});

export const usePathname = () => '/'
export const useSearchParams = () => new URLSearchParams()
