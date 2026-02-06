# Product Requirements Document (PRD): Jaws Co. Ltd. Website Revamp

## 1. Executive Summary
The goal is to upgrade the existing Jaws Co., Ltd. website to include a dynamic content management system (CMS). This will allow "no-code" updates for products and news articles via a secure Admin Interface. Additionally, the project will fix the broken Inquiries page and implement SEO best practices.

## 2. User Personas
1.  **Public User**: Browse products, search specifications, read news, and submit inquiries.
2.  **Admin User (Arthur)**: Log in to a private dashboard to add/edit/delete products, manage categories, publish news, and view inquiries.

## 3. Functional Requirements

### 3.1. Admin Authentication
- **Login Page**: Secure login for administrators.
- **Access Control**: `/admin` routes restricted to authenticated users only.

### 3.2. Product Management (Admin)
- **Product List**: View all products with search and filter by category.
- **Add/Edit Product**:
    - Name (Text)
    - Category (Dropdown from dynamic category list)
    - Image (Upload)
    - PDF Spec Sheet (Upload)
    - Specifications (Dynamic list of text strings)
    - Description (Rich Text or multi-line text)
- **Delete Product**: Soft or hard delete confirmation.

### 3.3. Category Management (Admin)
- **Manage Categories**: specific interface to add/edit/delete product categories (e.g., "0.5mm FFC", "1.0mm Wire").

### 3.4. News / Blog Module
- **Public News Page**: List articles in reverse chronological order (Title, Excerpt, Date, Thumbnail).
- **Article Detail Page**: Full content view/SEO optimized properties.
- **Admin News Managment**:
    - Create/Edit/Delete Articles.
    - Fields: Title, Slug (auto-generated), Date, Content (Rich Text), Cover Image.

### 3.5. Inquiries System
- **Public Form**: Fix existing form to submit data correctly.
- **Backend Processing**: Store inquiries in database AND/OR email notification to Jaws admins.
- **Admin View**: Optional list of received inquiries.

## 4. Non-Functional Requirements
- **SEO**: Dynamic metadata for Product and News pages.
- **Performance**: High SEO score (Lighthouse > 90).
- **Scalability**: Capable of handling hundreds of products.
- **Maintenance**: "Zero-code" needed for ongoing content updates.

## 5. Out of Scope
- E-commerce features (Cart, Checkout, Payment).
- Multi-language support (unless already present and requested to keep, currently English only observed).
- User accounts (customer login).

## 6. Acceptance Criteria
- [ ] Admin can log in and out.
- [ ] Admin can create a new product, upload an image, and see it on the public site immediately.
- [ ] Admin can create a news article and link to it.
- [ ] Contact form submission results in a saved record or email.
- [ ] No regression in existing design aesthetics.
