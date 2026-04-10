export function normalizePaginatedResponse(data) {
    if (Array.isArray(data)) {
      return {
        items: data,
        next: null,
        previous: null,
        count: data.length,
        paginated: false,
      };
    }
  
    return {
      items: Array.isArray(data?.results) ? data.results : [],
      next: data?.next ?? null,
      previous: data?.previous ?? null,
      count: data?.count ?? 0,
      paginated: true,
    };
  }
  
  export function getPageFromUrl(url) {
    if (!url) return null;
  
    try {
      const parsed = new URL(url);
      return parsed.searchParams.get("page");
    } catch {
      return null;
    }
  }