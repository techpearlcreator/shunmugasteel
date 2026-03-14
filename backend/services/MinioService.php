<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

class MinioService {
    private S3Client $client;
    private string   $bucket;
    private string   $publicBase;

    public function __construct() {
        $this->bucket     = MINIO_BUCKET;
        $this->publicBase = rtrim(MINIO_ENDPOINT, '/') . '/' . MINIO_BUCKET;

        $this->client = new S3Client([
            'version'                 => 'latest',
            'region'                  => MINIO_REGION,
            'endpoint'                => MINIO_ENDPOINT,
            'use_path_style_endpoint' => true,
            'credentials'             => [
                'key'    => MINIO_KEY,
                'secret' => MINIO_SECRET,
            ],
        ]);

        // Create bucket if it doesn't exist
        try {
            if (!$this->client->doesBucketExist($this->bucket)) {
                $this->client->createBucket(['Bucket' => $this->bucket]);
                $this->client->putBucketPolicy([
                    'Bucket' => $this->bucket,
                    'Policy' => json_encode([
                        'Version'   => '2012-10-17',
                        'Statement' => [[
                            'Effect'    => 'Allow',
                            'Principal' => ['AWS' => ['*']],
                            'Action'    => ['s3:GetObject'],
                            'Resource'  => ["arn:aws:s3:::{$this->bucket}/*"],
                        ]],
                    ]),
                ]);
            }
        } catch (AwsException $e) {
            error_log('MinIO bucket init error: ' . $e->getMessage());
        }
    }

    /**
     * Upload a file to MinIO and return the public URL.
     * @param string $tmpPath  PHP tmp file path ($_FILES['x']['tmp_name'])
     * @param string $origName Original filename (for extension)
     * @param string $folder   Sub-folder inside bucket (default: 'products')
     */
    public function upload(string $tmpPath, string $origName, string $folder = 'products'): string {
        $ext  = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
        $key  = $folder . '/' . uniqid('', true) . '_' . time() . '.' . $ext;
        $mime = mime_content_type($tmpPath) ?: 'application/octet-stream';

        $this->client->putObject([
            'Bucket'      => $this->bucket,
            'Key'         => $key,
            'SourceFile'  => $tmpPath,
            'ContentType' => $mime,
            'ACL'         => 'public-read',
        ]);

        return $this->publicBase . '/' . $key;
    }

    /**
     * Delete a file from MinIO by its full public URL.
     */
    public function delete(string $url): void {
        $key = ltrim(str_replace($this->publicBase, '', $url), '/');
        if (!$key) return;

        try {
            $this->client->deleteObject([
                'Bucket' => $this->bucket,
                'Key'    => $key,
            ]);
        } catch (AwsException $e) {
            error_log('MinIO delete error: ' . $e->getMessage());
        }
    }
}
