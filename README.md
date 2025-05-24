
<body>

  <h1><i class="fas fa-layer-group"></i> Fullstack GraphQL Monorepo</h1>

  <p>
    A modern, powerful fullstack monorepo built with <span class="badge">Next.js</span>, <span class="badge">GraphQL</span>, <span class="badge">Prisma</span>, and <span class="badge">Docker</span>.  
    Fully typed, scalable, and production-ready architecture for building robust SaaS products.
  </p>

  <div class="section">
    <h2><i class="fas fa-lock icon"></i> Authentication</h2>
    <p>
      Seamless auth using <strong>NextAuth</strong> supporting:
    </p>
    <ul>
      <li><i class="fas fa-key icon"></i> OAuth Providers (Google, GitHub, etc.)</li>
      <li><i class="fas fa-envelope icon"></i> Custom Email + Password flow</li>
      <li><i class="fas fa-user-shield icon"></i> Session-based server protection</li>
    </ul>
  </div>

  <div class="section">
    <h2><i class="fas fa-database icon"></i> Database</h2>
    <p>
      Built with <strong>Prisma ORM</strong> and supports:
    </p>
    <ul>
      <li><i class="fas fa-table icon"></i> PostgreSQL / SQLite</li>
      <li><i class="fas fa-code-branch icon"></i> Safe typed queries</li>
      <li><i class="fas fa-magic icon"></i> Auto migrations and seeding</li>
    </ul>
  </div>

  <div class="section">
    <h2><i class="fas fa-rocket icon"></i> GraphQL API</h2>
    <p>
      API built using <strong>Nexus</strong> (code-first schema) integrated with Prisma context:
    </p>
    <ul>
      <li><i class="fas fa-code icon"></i> Modular schema structure</li>
      <li><i class="fas fa-shield-alt icon"></i> Auth-aware resolvers</li>
      <li><i class="fas fa-terminal icon"></i> Runs inside <code>/api/graphql</code> route</li>
    </ul>
  </div>

  <div class="section">
    <h2><i class="fas fa-boxes icon"></i> Monorepo Architecture</h2>
    <p>
      A well-structured monorepo-like layout:
    </p>
    <ul>
      <li><code>src/app</code> – Next.js App Router pages</li>
      <li><code>graphql/</code> – GraphQL schema & resolvers</li>
      <li><code>lib/</code> – Shared server-side logic (auth, mail, context)</li>
      <li><code>prisma/</code> – DB schema and migrations</li>
    </ul>
  </div>

  <div class="section">
    <h2><i class="fab fa-docker icon"></i> Docker Ready</h2>
    <p>
      Easily deployable with Docker and supports CI/CD integrations. Local or cloud database can be used, with environment-aware secrets via <code>example.env</code>.
    </p>
  </div>

</body>
</html>
