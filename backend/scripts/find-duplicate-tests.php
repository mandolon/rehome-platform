<?php
$rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(__DIR__ . '/../tests'));
$classes = []; $dupes = [];
foreach ($rii as $file) {
  if ($file->isDir() || $file->getExtension() !== 'php') continue;
  $code = file_get_contents($file->getPathname());
  if (preg_match('/class\s+([A-Za-z0-9_]+)\s+extends\s+TestCase/', $code, $m)) {
    $cls = $m[1];
    $classes[$cls] = $classes[$cls] ?? [];
    $classes[$cls][] = $file->getPathname();
  }
}
foreach ($classes as $cls => $paths) if (count($paths) > 1) $dupes[$cls] = $paths;
if ($dupes) {
  echo "Duplicate PHPUnit classes found:\n";
  foreach ($dupes as $cls => $paths) {
    echo " - $cls\n   " . implode("\n   ", $paths) . "\n";
  }
  exit(1);
}
echo "No duplicate test classes.\n";
