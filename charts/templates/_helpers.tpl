{{- define "frontend_app.name" -}}
{{- default .Chart.Name .Values.deployment.name | trunc 63 | trimSuffix "-" }}
{{- end }}