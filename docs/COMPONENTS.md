# React Components

## Public (`src/components/public`)
| Component | Props | Purpose |
|---|---|---|
| Navbar | – | Sticky nav, smooth scroll links, CBSE badge, 3D Virtual Tour button, mobile hamburger |
| NoticeTicker | – | Fetches notices, CSS marquee of titles |
| Hero | `heading` | Background image + gradient overlay + settings heading |
| About | `text` | Welcome heading/subheading + `about_text` paragraphs |
| WhyAVM | – | Static 10-card grid with graduation-cap icons |
| Gallery | – | Fetches gallery, grid + lightbox |
| AdmissionForm | – | Split layout form, POSTs admission, toasts |
| Testimonials | – | Auto-play slider + YouTube modal |
| Footer | `settings` | Contact info, links, social icons, copyright |

## Admin (`src/components/admin`)
| Component | Props | Purpose |
|---|---|---|
| Sidebar | `open, onClose` | Fixed nav with Lucide icons, gold active state, mobile drawer, logout |
| AdminNavbar | `title, onMenu` | Page title, username, logout |
| StatCard | `icon, label, value, color` | Dashboard counter card |
| DataTable | `columns, rows, searchKeys, pageSize=10, actions, toolbar` | Search + pagination table. `columns: [{key,label,render?}]` |
| Modal | `open, title, onClose, children, footer` | Backdrop modal |
| Toast | – (`ToastProvider`, `useToast()` → `toast.success/error`) | Top-right auto-dismiss notifications |
| ProtectedRoute | `children` | Redirects to `/admin/login` if unauthenticated |
| AdminLayout | `title, children` | Sidebar + navbar shell (helper) |

## Context
- **AuthContext** — `{isAuthenticated, adminUser, login(u,p), logout(), loading}`
