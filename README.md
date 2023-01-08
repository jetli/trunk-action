<p align="center">
  <a href="https://github.com/jetli/trunk-action/actions"><img alt="trunk-action status" src="https://github.com/jetli/trunk-action/workflows/build-test/badge.svg"></a>
</p>

# `trunk-action`

Install `Trunk` by downloading the executable (much faster than `cargo install trunk`, seconds vs minutes).

## Usage

```yaml
- uses: jetli/trunk-action@v0.3.0
  with:
    # Optional version of trunk to install(eg. 'v0.8.1', 'latest')
    version: 'latest'
```

## Resources
- https://github.com/thedodd/trunk
