const decoder = new TextDecoder();

// Download Tailwind CSS CLI if it's not already downloaded
const tailwindCliUrl = "https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-linux-x64";
const fileName = "./tailwindcss";

// Check if the file already exists
try {
  const stat = await Deno.stat(fileName);
  if (stat.isFile) {
    console.log("Tailwind CLI already exists.");
  }
} catch {
  // If it doesn't exist, download it
  console.log("Downloading Tailwind CSS CLI...");
  const response = await fetch(tailwindCliUrl);
  const file = await Deno.open(fileName, { write: true, create: true });
  const reader = response.body?.getReader();
  let { value, done } = await reader?.read()!;
  while (!done) {
    if (value) {
      await file.write(value);
    }
    ({ value, done } = await reader?.read()!);
  }
  file.close();
  // Make it executable
  await Deno.chmod(fileName, 0o755);
}
const command = new Deno.Command(fileName, {
  args: ["-i", "./static/css/tailwind.css", "-o", "./static/css/tailwind.css"],
  stdout: "piped",
  stderr: "piped"
});

const { stdout, stderr } = await command.output();
console.log(decoder.decode(stdout));
if (stderr.length) {
  console.error(decoder.decode(stderr));
}
