<p align="center">
  <a href="https://github.com/jetli/trunk-action/actions"><img alt="trunk-action status" src="https://github.com/jetli/trunk-action/workflows/build-test/badge.svg"></a>
</p>

# `trunk-action`

Install [`Trunk`](https://github.com/thedodd/trunk) by downloading the executable (much faster than `cargo install trunk`, seconds vs minutes).

## Usage

```yaml
- uses: jetli/trunk-action@v0.4.0
  with:
    # Optional version of trunk to install(eg. 'v0.16.0', 'latest')
    version: 'latest'
```

## Resources
- https://github.com/thedodd/trunk
