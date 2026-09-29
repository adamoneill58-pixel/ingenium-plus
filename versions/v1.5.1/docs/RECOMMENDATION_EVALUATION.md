# Recommendation evaluation

## Automated evaluation

Run:

```bash
npm run recommendations:evaluate
```

The committed synthetic fixture set compares the hybrid ranking with a simpler lexical-order baseline and reports Precision@K, Recall@K, NDCG@K, eligibility-violation rate and catalogue coverage. `tests/v151-recommendations.test.mjs` additionally verifies:

- fixed inputs produce identical ranked output;
- expired/closed and wrong-level modules are removed before ranking;
- opted-out academics never enter collaborator ranking;
- explanations contain actual matched factors;
- local feature vectors are deterministic;
- evaluation metric calculations are stable.

The fixture set is a regression harness, not evidence of production superiority. Any claimed improvement must be repeated on a reviewer-labelled institutional evaluation set.

## Verified synthetic result — 20 September 2026

The committed evaluator currently reports:

| Metric | Hybrid engine | Lexical baseline / threshold |
| --- | ---: | ---: |
| Precision@3 | 0.583333 | — |
| Recall@3 | 1.000000 | — |
| NDCG@3 | 0.959860 | 0.662178 |
| Synthetic NDCG improvement | 0.297682 | must be positive |
| Eligibility-violation rate | 0.000000 | must equal zero |
| Catalogue coverage | 1.000000 | must not regress |

These numbers describe only the small synthetic fixture set committed to the
repository. They are useful for detecting regressions and proving that the
evaluation machinery runs; they are not evidence of real student or academic
outcomes.

## Baselines required for staging

1. Popular/current eligible content.
2. Exact taxonomy overlap only.
3. Lexical ranking without semantic or graph features.
4. Current hybrid engine.

Compare by recommendation type; aggregate metrics can hide eligibility failures or a weak staff matcher.

## Human evaluation protocol

Use a limited, consented panel of students and academics. Reviewers rate relevance, eligibility plausibility, explanation accuracy, unexpected exposure and usefulness on a fixed rubric. Record role and home organisation only where necessary; do not collect protected attributes. An academic must confirm discoverability before appearing in any pilot candidate set.

## Outcome measures

Clicks, saves and dismissals measure interaction only. Expressions of interest measure an in-platform statement only. None may be relabelled as an application, enrolment, partnership or collaboration. Useful longer-term measures require institutional agreement: verified application start, completed application, accepted collaboration contact and eventual joint output.

## Release thresholds

- Eligibility-violation rate must be exactly zero in automated and reviewed staging fixtures.
- Every displayed result must have at least one valid explanation and a stored engine version.
- Opt-out tests must pass.
- Hybrid NDCG should exceed the lexical baseline on the approved evaluation set without reducing coverage below the agreed threshold.
- No unresolved critical privacy or security finding.

## Current evidence boundary

Automated synthetic evaluation is implemented and run locally. No real user-labelled dataset, human evaluation or outcome evaluation has occurred; those require approved pilot participants and governance. Consequently v1.5.1 makes no claim that the hybrid engine outperforms alternatives in real use.
