#!/bin/bash

# Event Finder - SSL Certificate Generator
# Creates self-signed SSL certificates for local HTTPS development

echo "🔐 Generating SSL Certificates for Event Finder..."
echo "==================================================="

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CERTS_DIR="$PROJECT_ROOT/certs"

# Create certs directory if it doesn't exist
mkdir -p "$CERTS_DIR"

# Check if OpenSSL is installed
if ! command -v openssl &> /dev/null; then
    echo "❌ OpenSSL is not installed. Please install OpenSSL first."
    echo "   On Ubuntu/Debian: sudo apt-get install openssl"
    echo "   On macOS: brew install openssl"
    echo "   On Windows: Use Git Bash or install OpenSSL"
    exit 1
fi

# Certificate configuration
DAYS_VALID=365
KEY_SIZE=2048
COUNTRY="IL"
STATE="Tel Aviv"
LOCALITY="Tel Aviv"
ORGANIZATION="EventFinder Dev"
ORGANIZATIONAL_UNIT="Development"
COMMON_NAME="localhost"

# Generate private key
echo "📝 Generating private key..."
openssl genrsa -out "$CERTS_DIR/server.key" $KEY_SIZE 2>/dev/null

# Generate certificate signing request (CSR)
echo "📝 Generating certificate signing request..."
openssl req -new -key "$CERTS_DIR/server.key" -out "$CERTS_DIR/server.csr" -subj "/C=$COUNTRY/ST=$STATE/L=$LOCALITY/O=$ORGANIZATION/OU=$ORGANIZATIONAL_UNIT/CN=$COMMON_NAME" 2>/dev/null

# Create SAN (Subject Alternative Name) configuration
cat > "$CERTS_DIR/san.cnf" << EOF
[req]
default_bits = $KEY_SIZE
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = req_ext
x509_extensions = v3_ca

[dn]
C = $COUNTRY
ST = $STATE
L = $LOCALITY
O = $ORGANIZATION
OU = $ORGANIZATIONAL_UNIT
CN = $COMMON_NAME

[req_ext]
subjectAltName = @alt_names

[v3_ca]
subjectAltName = @alt_names
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, keyEncipherment, keyCertSign

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
DNS.3 = eventfinder.local
DNS.4 = *.eventfinder.local
IP.1 = 127.0.0.1
IP.2 = ::1
EOF

# Generate self-signed certificate
echo "📝 Generating self-signed certificate..."
openssl x509 -req -days $DAYS_VALID -in "$CERTS_DIR/server.csr" -signkey "$CERTS_DIR/server.key" -out "$CERTS_DIR/server.crt" -extensions v3_ca -extfile "$CERTS_DIR/san.cnf" 2>/dev/null

# Generate PEM file (combined certificate and key)
echo "📝 Generating PEM file..."
cat "$CERTS_DIR/server.crt" "$CERTS_DIR/server.key" > "$CERTS_DIR/server.pem"

# Set proper permissions
chmod 600 "$CERTS_DIR/server.key"
chmod 644 "$CERTS_DIR/server.crt"
chmod 644 "$CERTS_DIR/server.pem"

# Clean up CSR and config
rm -f "$CERTS_DIR/server.csr" "$CERTS_DIR/san.cnf"

# Verify certificate
echo ""
echo "🔍 Verifying certificate..."
openssl x509 -in "$CERTS_DIR/server.crt" -text -noout | grep -A1 "Subject:"

echo ""
echo "==================================================="
echo "✅ SSL Certificates generated successfully!"
echo ""
echo "📁 Certificate files location: $CERTS_DIR/"
echo "   - server.key (Private Key)"
echo "   - server.crt (Certificate)"
echo "   - server.pem (Combined PEM)"
echo ""
echo "📋 Certificate validity: $DAYS_VALID days"
echo ""
echo "⚠️  Note: This is a self-signed certificate for development."
echo "   Browsers will show a security warning. Click 'Advanced' and"
echo "   'Proceed to localhost' to continue."
echo ""
echo "💡 To trust the certificate on your system:"
echo "   macOS: Add server.crt to Keychain Access"
echo "   Windows: Import server.crt to Trusted Root CAs"
echo "   Linux: Copy to /usr/local/share/ca-certificates/"
echo "==================================================="
