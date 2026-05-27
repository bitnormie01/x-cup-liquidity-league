# 01-roles/directives — Index

The Mastermind writes one directive file per phase invocation:

```
D<n>-<phase-id>.md   e.g. D1-P01-01.md, D2-P01-02.md, D17-P04-03.md
```

`<n>` is monotonically increasing across the entire project. Never reused.

When a phase needs re-work (BLOCKED or PARTIAL), the Mastermind writes a NEW directive at the next `n`, with `revision: 2` (or higher) in the YAML, and an "Unblock Hints" section in the body.

## Indexing

A directory listing is your index. Filenames are sortable by `n` lexically only up to D9; past D10 use `ls -v` or sort by `created-at` in the frontmatter.

## Lifecycle

- Mastermind: writes a directive, commits `[mm] directive D<n> for <phase-id>`, pushes.
- Executor: reads the directive referenced by `03-state/state-counter.md → Active Directive`.
- After the Executor's report lands, the directive is historical. It is NOT deleted — it's the audit trail.
