<p align="center">
  <a href="https://github.com/jetli/trunk-action/actions"><img alt="trunk-action status" src="https://github.com/jetli/trunk-action/workflows/build-test/badge.svg"></a>
</p>

# `trunk-action`

Install [`Trunk`](https://github.com/trunk-rs/trunk) by downloading the
executable (much faster than `cargo install trunk`, seconds vs minutes).

## Usage

```yaml
- uses: jetli/trunk-action@v0.5.1
  with:
    # Optional version of trunk to install(eg. 'v0.21.14', 'latest')
    version: 'latest'
```

## Resources

- https://github.com/trunk-rs/trunk
