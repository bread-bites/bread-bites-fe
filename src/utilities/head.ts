import { m } from "@paraglide/messages";
import { AnyRouteMatch } from "@tanstack/react-router";

export const createHead = (title: string, other?: AnyRouteMatch['meta'], description?: string) => ({
  meta: [
    {
      title: `${title} - ${m.website_title()}`
    },
    {
      name: 'description',
      content: description ?? m.website_description()
    },
    ...(other ?? [])
  ] as AnyRouteMatch['meta'],
})