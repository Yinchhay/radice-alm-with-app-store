# API Documents
This is the API V1 documentation for the project. it list all the API routes and their description of what they do and what they return.

❌ = not implemented yet. <br>
✅ = implemented.

# API V1
   - # Auth:
      - # User:
        - # Get Routes:
            - ❌ ``/api/v1/auth/user/involve/projects``: Get current authenticated user project that they are involved in.
        - # Post Routes:
            - ❌ ``/api/v1/auth/user/update/profile``: Allow authenticated user to update their profile.
            - ❌ ``/api/v1/auth/user/connect/oauth/github``: Allow user to connect with oauth github. 
            - ❌ ``/api/v1/auth/user/disconnect/oauth/github``: Allow user to remove their oauth github account. 
      - # Project:
        <!-- - # Get Routes: -->
        - # Post Routes:
            - ❌ ``/api/v1/auth/project/create``: Create a new project. Only for authenticated users with the ``"CREATE_PROJECT"`` permission
            - ❌ ``/api/v1/auth/project/edit``: Save project progress. Only for authenticated users with the ``"EDIT_PROJECT"`` permission
      - # Admin:
        - # Get Routes:
            - ❌ ``/api/v1/auth/admin/users``: Get all users. Only for authenticated users with the ``"REVIEW_APPLICANT"`` permission
                - search params:
                    - ``limit``: limit number of users per query.
            - ❌ ``/api/v1/auth/admin/roles``: Get all roles. Only for authenticated users with the ``"MODIFY_ROLE"`` permission
            - ❌ ``/api/v1/auth/admin/user/[user_id]``: Get a user by user id. Only for authenticated users with the ``"REVIEW_APPLICANT"`` permission
            - ❌ ``/api/v1/auth/admin/role/[role_id]``: Get a role by role id. Only for authenticated users with the ``"MODIFY_ROLE"`` permission
        - # Post Routes:
            - ❌ ``/api/v1/auth/admin/create/role``: Create a new role. Only for authenticated users with the ``"MODIFY_ROLE"`` permission
            - ❌ ``/api/v1/auth/admin/update/role``: Update role. Only for authenticated users with the ``"MODIFY_ROLE"`` permission
            - ❌ ``/api/v1/auth/admin/user/[user_id]/remove``: Remove a user by their user id. Only for authenticated users with the ``"DELETE_MEMBER_ACCOUNT"`` permission
            - ❌ ``/api/v1/auth/admin/role/[role_id]/remove``: Remove a role by their role id. Only for authenticated users with the ``"MODIFY_ROLE"`` permission
   - # Public:
      - # Project:
        - # Get Routes:
            - ❌ ``/api/v1/public/project/[project_id]``: Get a project by project id. will return project only if project ``is_public = true``, if project ``is_public = false`` the request must be from authenticated user with the ``"EDIT_PROJECT"`` permission
            - ❌ ``/api/v1/public/user/[user_id]``: Get a user. will return user only if ``is_active = true``.
            - ❌ ``/api/v1/public/featured/partner``: Get all featured partner. will return featured partner only if partner ``is_public = true`` and ``is_feature = true``
      - # User:
        - # Get Routes:
            - ❌ ``/api/v1/public/user/logout``: Allow user to logout.
        - # Post Routes:
            - ✅ ``/api/v1/public/user/login``: Allow user to login.
            - ❌ ``/api/v1/public/user/register``: Allow user to register.
   - # Verification:
     - # User:
        - # Get Routes:
            - ❌ ``/api/v1/verify/auth/user``: Use in middleware to verify current authenticated user by checking session and return status code if ```status = 200```, user session is valid which mean user is logged in.
        <!-- - # Post Routes: -->