---
name: session-wrap
description: Summarize session work, record learnings, and update project docs for seamless continuity
argument-hint: "[optional: specific focus area]"
---

# Session Wrap-Up

Summarize what was accomplished this session, record learnings, and update all project documentation to reflect the current state. This ensures the next session starts productively with zero context loss.

## Workflow

### Step 1: Gather Context

Read these files in parallel to understand the current state:
- `CLAUDE.md` — project instructions, architecture, pitfalls, session continuity
- `docs/STATUS.md` — high-level project status, completed work, current state
- `docs/tasks.md` — task tracker with phase-by-phase progress
- `docs/plans/2026-03-05-feat-klar-interactive-job-application-plan.md` — implementation plan
- Auto-memory at `~/.claude/projects/-Users-dbenger-projects-job-application/memory/MEMORY.md`

Also run in parallel:
- `git log --oneline -10` — recent commits
- `git status` — uncommitted changes
- `git diff --stat` — what files changed

### Step 2: Summarize Session

Present a concise summary to the user covering:
1. **What was done** — list of changes, features added/modified, bugs fixed
2. **Key decisions made** — architecture choices, trade-offs, approach taken
3. **What was learned** — pitfalls discovered, patterns that worked, things to remember
4. **Current state** — what's committed, what's uncommitted, what's deployed
5. **What's next** — next phase/tasks to tackle in the following session

If $ARGUMENTS is provided, focus the summary on that area.

### Step 3: Update CLAUDE.md

Edit `CLAUDE.md` to reflect the current state:
- Update **Session Continuity** section with what was done and what's remaining
- Update any sections affected by the changes (Architecture, Design System, Pitfalls, etc.)
- Add new pitfalls or patterns discovered during this session
- Update commit references if new commits were made
- Update the **Build Phases** checklist if phases were started or completed
- Keep changes minimal — only update what actually changed

### Step 4: Update docs/STATUS.md

Edit `docs/STATUS.md` to reflect:
- Add new commits to the "What's done" table
- Update "Current state" if build profile changed
- Update "Decisions made" if architecture changed
- Move completed items from pending to done
- Add new uncommitted changes section if applicable
- Update remaining tasks and next steps

### Step 5: Update docs/tasks.md

Edit `docs/tasks.md` to reflect:
- Mark completed tasks as **Done**
- Add new tasks discovered during this session
- Add detail sections for significant completed tasks (follow the `### TXX Detail` pattern)
- Update any task descriptions that changed scope
- If a phase was completed, note it in the phase header

### Step 6: Update Memory

Edit the auto-memory file at `~/.claude/projects/-Users-dbenger-projects-job-application/memory/MEMORY.md`:
- Record new pitfalls or gotchas discovered
- Update patterns section with new conventions
- Record what was accomplished and what's next
- Keep it concise — memory file should stay under 200 lines

## Constraints

- Do NOT create new documentation files — only update existing ones
- Do NOT modify source code — this is a docs-only operation
- Keep all updates factual and concise — no filler text
- Preserve existing formatting and structure of each file
- If nothing changed in a file's domain, skip updating that file
- The plan file (`docs/plans/...`) is read-only during session-wrap — it's a reference, not updated here

## Success Criteria

- [ ] User receives clear summary of session work
- [ ] CLAUDE.md Session Continuity section is current
- [ ] docs/STATUS.md reflects latest state
- [ ] docs/tasks.md has all tasks at correct status with details for significant work
- [ ] Memory file has new learnings recorded
- [ ] Next session can start immediately from the startup ritual without re-discovery
