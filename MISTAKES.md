# Mistakes in this project

A plain list of what was wrong and what to watch out for.

---

## Bugs that were fixed

**1. Order form quantity from the URL**  
The quantity came from the URL (`?qty=...`) and was never checked. If someone typed something like `?qty=abc` or `?qty=-2`, the number could be NaN or negative, and the total could show as “$NaN” or wrong. It’s now forced to be between 1 and 5, and invalid values default to 1.

**2. 404 page “Return to Home” link**  
The link used a normal `<a href="/">`, so clicking it reloaded the whole app instead of staying in the React app. It was changed to React Router’s `<Link to="/">` so navigation stays in-app.

**3. Admin orders table when there are no results**  
When no orders matched the filters, a `<div>` was rendered directly inside the `<table>`. In HTML, a table may only have specific children (like `thead`, `tbody`). Having a div there is invalid. The empty message was moved into a proper table row inside `tbody` with a colspan.

**4. Visiting /vault with nothing after it**  
Going to `/vault` showed the admin sidebar but an empty main area, because there was no route for “just /vault”. An index route was added so `/vault` redirects to `/vault/dashboard`.

**5. Unused import in admin layout**  
The `Settings` icon was imported from lucide-react but never used. The import was removed.

---

## Other issues (not fixed in code)

**6. Admin password in the source code**  
The admin login uses a hardcoded password in `AdminLogin.tsx`. Anyone who can see the code can see the password. For a real app you should use environment variables and a proper backend for authentication.

**7. Order form “Placing order…” state on success**  
When the order succeeds, you navigate away but never set “submitting” back to false. Because the page unmounts, you don’t see a bug, but it’s tidier to clear that state (or set it to false) before navigating.

**8. No check against product stock**  
Users can pick quantity up to 5, but the code never checks if the product has enough stock. So someone could “order” more than you have. You could limit the quantity picker by `product.stock` and/or validate on the order form.

**9. Product gallery with no images**  
If a product had an empty `images` array, the gallery would still try to show `images[0]`, which is undefined. You could add a check like “only render the image if `images.length > 0`” to avoid broken or missing images.

**10. Two toast components**  
The app renders both the shadcn Toaster and Sonner. Only Sonner is used for your success/error toasts. The other one is unused; you can remove it to avoid confusion.

**11. NavLink component is never used**  
You have a `NavLink` component but the header and the rest of the app use plain `Link`. So that component is dead code unless you plan to use it later. You can delete it or start using it for active link styling.

**12. Form errors not cleared on success**  
When validation fails, you set field errors. When the user fixes the form and submits successfully, you don’t clear those errors before navigating. Usually it’s fine because you leave the page, but if you ever show a success state on the same page, old errors could still be visible. Clearing errors on successful submit is a good habit.

---

## Summary

- **Fixed:** 5 concrete bugs (quantity validation, 404 link, table HTML, /vault redirect, unused import).
- **Left for you:** Security (password), UX (stock, form state), small robustness (empty images, duplicate toaster, unused NavLink, clearing errors).

If you want, we can go through any of these and change the code together.
