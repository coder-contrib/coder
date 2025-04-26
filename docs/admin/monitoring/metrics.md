# Deployment Metrics

Coder exposes many metrics which give insight into the current state of a live
Coder deployment. Our metrics are designed to be consumed by a
[Prometheus server](https://prometheus.io/).

If you don't have an Prometheus server installed, you can follow the Prometheus
[Getting started](https://prometheus.io/docs/prometheus/latest/getting_started/)
guide.

## Setting up metrics

To set up metrics monitoring, please read our
[Prometheus integration guide](../integrations/prometheus.md). The following
links point to relevant sections there.

- [Enable Prometheus metrics](../integrations/prometheus.md#enable-prometheus-metrics)
  in the control plane
- [Enable the Prometheus endpoint in Helm](../integrations/prometheus.md#kubernetes-deployment)
  (Kubernetes users only)
- [Configure Prometheus to scrape Coder metrics](../integrations/prometheus.md#prometheus-configuration)
- [See the list of available metrics](../integrations/prometheus.md#available-metrics)

## Monitoring Best Practices

### Key Metrics to Monitor

Here are some of the most important metrics to track for operational health:

1. **API Performance**
   - `coderd_api_request_latencies_seconds`: Track latency by endpoint to identify slow APIs
   - `coderd_api_concurrent_requests`: Monitor by path and method to identify bottlenecks
   - `coderd_api_requests_processed_total`: Track error rates by status code

2. **Workspace Status**
   - `coderd_workspace_latest_build_status`: Monitor workspace build success rates
   - `coderd_agents_connections`: Track agent connectivity

3. **User Activity**
   - `coderd_api_active_users_duration_hour`: Monitor active user count
   - `coderd_insights_templates_active_users`: Track template usage

4. **System Health**
   - `go_memstats_alloc_bytes`: Monitor memory usage
   - `process_cpu_seconds_total`: Track CPU utilization

### Example Prometheus Queries

These queries can help monitor common scenarios:

```
# API Error Rate (5xx errors as percentage of total)
sum(rate(coderd_api_requests_processed_total{code=~"5.."}[5m])) / 
sum(rate(coderd_api_requests_processed_total[5m])) * 100

# Slow API Endpoints (95th percentile latency > 1s)
histogram_quantile(0.95, sum(rate(coderd_api_request_latencies_seconds_bucket[5m])) by (path, le)) > 1

# Failed Workspace Builds (last 24h)
sum(increase(coderd_workspace_builds_total{status="failed"}[24h])) by (template_name)
```
