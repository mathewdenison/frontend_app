# _helpers.tpl

{{- define "frontend_app.name" -}}
{{- default .Chart.Name .Values.nameOverride | replace "_" "-" | lower | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "frontend_app.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | replace "_" "-" | lower | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride | replace "_" "-" }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | replace "_" "-" | lower | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | replace "_" "-" | lower | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}