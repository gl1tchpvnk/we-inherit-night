# Initial Git baseline

Prepared 2026-11-12 from the working Pass 3D state, including the subsequent encounter layout correction. No gameplay, contract, narrative, artwork or test implementation changed during preparation.

- No existing Git repository or remote was present. Initialized local `main`; used the existing configured Git author identity.
- Preserved source, approved artwork, documentation, lockfiles and complete test suites.
- Expanded `.gitignore` for credential/key files, private save directories, runtime campaign/transaction journals, dependencies, caches and build outputs. `.env.example` remains tracked and contains only empty values/public configuration.
- Public Sandbox evidence in `docs/evidence` is retained as documentation and regression input (for example, `tests/pass3c.test.mjs` reads it). These exported public test records are distinct from private runtime saves/journals under `.local`, which are excluded. No files were deleted or reorganized.
- Pattern scan covers prospective tracked file bytes for private-key blocks, NEAR secret-key encodings, common provider tokens, credential assignments and password-bearing URLs. Two matches were reviewed: explicit mock credentials `unit-test-placeholder` and `mock-only`. No exposed credentials found. Pattern scanning is not a guarantee against every possible secret format.
- Ignore probes confirm secrets, private runtime state, dependencies and builds are excluded while source/assets/tests and dependency lockfiles remain eligible.
- Application tests/build were not rerun: only repository hygiene/documentation changed. Existing Pass 3D and encounter-layout verification remains applicable.
- Current authorized remote: **public** `https://github.com/gl1tchpvnk/we-inherit-night`, as clarified by the user for judging. The user explicitly authorized restoring public visibility and pushing after the credential/history audit. The same repository is used; no replacement, force-push or remote history overwrite. The earlier private-repository instruction is superseded.

Public-push audit: all 236 baseline blobs (about 53.5 MB) and the initial commit were scanned; no exposed credentials or private wallet/runtime files found. The two mock credential matches above remain intentional. Additional repository-hygiene documentation is audited before push. Pattern-scan limitations still apply.
