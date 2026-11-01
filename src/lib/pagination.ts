export const MAX_PAGE_SIZE = 100

interface Page<T> {
  data: T[] | null
  total: number
}

// Walks every page of a paginated endpoint and returns all items
export async function fetchAllPages<T>(fetchPage: (page: number) => Promise<Page<T>>): Promise<T[]> {
  const items: T[] = []

  for (let page = 1; ; page++) {
    const { data, total } = await fetchPage(page)
    const pageItems = data ?? []
    items.push(...pageItems)

    if (pageItems.length === 0 || items.length >= total) {
      return items
    }
  }
}
