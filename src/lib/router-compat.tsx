import {
  Link as RouterLink,
  useLocation as useRouterLocation,
  useParams as useRouterParams,
  useNavigate,
  useSearch,
  Outlet,
} from "@tanstack/react-router";

export { Outlet };
import type { AnchorHTMLAttributes, ReactElement, ReactNode } from "react";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  replace?: boolean;
  children?: ReactNode;
};

/** react-router-dom compatible <Link to="/string"> built on TanStack Router. */
export function Link({ to, replace, ...rest }: LinkProps) {
  const AnyLink = RouterLink as unknown as (props: Record<string, unknown>) => ReactElement;
  return <AnyLink to={to} replace={replace} {...rest} />;
}

export function useLocation() {
  return useRouterLocation();
}

export function useParams<T extends Record<string, string | undefined>>(): T {
  return useRouterParams({ strict: false }) as T;
}

/** Minimal react-router-dom useSearchParams shim. */
export function useSearchParams(): [
  URLSearchParams,
  (next: Record<string, string> | URLSearchParams, opts?: { replace?: boolean }) => void,
] {
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useNavigate();

  const params = new URLSearchParams();
  Object.entries(search ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null) params.set(k, String(v));
  });

  const setSearchParams = (
    next: Record<string, string> | URLSearchParams,
    opts?: { replace?: boolean },
  ) => {
    const obj =
      next instanceof URLSearchParams ? Object.fromEntries(next.entries()) : next;
    navigate({ to: ".", search: obj as never, replace: opts?.replace ?? false });
  };

  return [params, setSearchParams];
}