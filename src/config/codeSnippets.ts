export type CodeLanguage = "python" | "javascript" | "typescript" | "java" | "cpp" | "rust" | "go" | "html" | "sql";

export const CODE_SNIPPETS: Record<CodeLanguage, string[]> = {
  python: [
    "def calculate_fibonacci(n):\n    if n <= 1:\n        return n\n    return calculate_fibonacci(n - 1) + calculate_fibonacci(n - 2)",
    "class Rocket:\n    def __init__(self, name, thrust):\n        self.name = name\n        self.thrust = thrust\n    def launch(self):\n        print(f'{self.name} launching with {self.thrust} kN!')",
    "import asyncio\nasync def fetch_data(url):\n    async with aiohttp.ClientSession() as session:\n        async with session.get(url) as response:\n            return await response.json()",
    "numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nsquared_evens = [x**2 for x in numbers if x % 2 == 0]\nprint(f'Result: {squared_evens}')",
    "import os\nfrom datetime import datetime\ndef log_event(message):\n    timestamp = datetime.now().isoformat()\n    with open('app.log', 'a') as f:\n        f.write(f'[{timestamp}] {message}\\n')"
  ],
  javascript: [
    "const fetchData = async (endpoint) => {\n  const response = await fetch(endpoint);\n  const data = await response.json();\n  return data.results;\n};",
    "function debounce(func, wait) {\n  let timeout;\n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => func.apply(this, args), wait);\n  };\n}",
    "const items = [1, 2, 3, 4, 5];\nconst sum = items.reduce((acc, curr) => acc + curr, 0);\nconsole.log(`Total sum is: ${sum}`);",
    "export class RocketEngine {\n  constructor(power) {\n    this.power = power;\n    this.isIgnited = false;\n  }\n  ignite() {\n    this.isIgnited = true;\n  }\n}",
    "const parseJSON = (str) => {\n  try {\n    return JSON.parse(str);\n  } catch (error) {\n    console.error('Invalid JSON string:', error);\n    return null;\n  }\n};"
  ],
  typescript: [
    "interface RocketConfig {\n  id: string;\n  altitudeKm: number;\n  velocityMs: number;\n  payloadCapacityKg: number;\n}",
    "type FlightStatus = 'idle' | 'countdown' | 'in-flight' | 'orbit' | 'landed';\n\nfunction updateStatus(status: FlightStatus): void {\n  console.log(`Current status: ${status}`);\n}",
    "class TelemetryProvider<T extends Record<string, unknown>> {\n  private data: T[] = [];\n  public push(record: T): void {\n    this.data.push(record);\n  }\n}",
    "export async function launchMission<T>(config: RocketConfig): Promise<T> {\n  const res = await api.post('/launch', config);\n  return res.data as T;\n}",
    "type ReadonlyRocket = Readonly<RocketConfig>;\nconst defaultRocket: ReadonlyRocket = {\n  id: 'saturn-v',\n  altitudeKm: 0,\n  velocityMs: 0,\n  payloadCapacityKg: 140000,\n};"
  ],
  java: [
    "public class RocketLauncher {\n    private final String name;\n    private int altitude;\n\n    public RocketLauncher(String name) {\n        this.name = name;\n        this.altitude = 0;\n    }\n}",
    "public static void main(String[] args) {\n    System.out.println(\"TypeRocket systems nominal.\");\n    List<String> planets = Arrays.asList(\"Mars\", \"Venus\", \"Jupiter\");\n    planets.forEach(System.out::println);\n}",
    "public async CompletableFuture<String> fetchTelemetry() {\n    return CompletableFuture.supplyAsync(() -> {\n        return \"Telemetry received: 100% signal strength.\";\n    });\n}",
    "public class OrbitCalculator {\n    public double calculateVelocity(double radius, double mass) {\n        final double G = 6.67430e-11;\n        return Math.sqrt(G * mass / radius);\n    }\n}",
    "@Override\npublic boolean equals(Object obj) {\n    if (this == obj) return true;\n    if (obj == null || getClass() != obj.getClass()) return false;\n    return true;\n}"
  ],
  cpp: [
    "#include <iostream>\n#include <vector>\n#include <memory>\n\nint main() {\n    std::vector<int> velocity = {100, 250, 500, 1000};\n    for (const auto& v : velocity) {\n        std::cout << \"Speed: \" << v << \" m/s\" << std::endl;\n    }\n    return 0;\n}",
    "template <typename T>\nclass Vector3D {\npublic:\n    T x, y, z;\n    Vector3D(T x, T y, T z) : x(x), y(y), z(z) {}\n    T magnitude() const { return std::sqrt(x*x + y*y + z*z); }\n};",
    "class RocketEngine {\nprivate:\n    double thrust;\npublic:\n    explicit RocketEngine(double t) : thrust(t) {}\n    void ignite() const {\n        std::cout << \"Engine ignited with thrust: \" << thrust << \" kN\\n\";\n    }\n};",
    "#include <algorithm>\nvoid sortTelemetry(std::vector<double>& data) {\n    std::sort(data.begin(), data.end(), [](double a, double b) {\n        return a > b;\n    });\n}",
    "std::unique_ptr<RocketEngine> engine = std::make_unique<RocketEngine>(8500.0);\nengine->ignite();"
  ],
  rust: [
    "fn calculate_orbital_speed(radius: f64, mass: f64) -> f64 {\n    let g = 6.67430e-11;\n    (g * mass / radius).sqrt()\n}",
    "struct Rocket {\n    name: String,\n    altitude: u64,\n}\n\nimpl Rocket {\n    fn new(name: &str) -> Self {\n        Self { name: name.to_string(), altitude: 0 }\n    }\n}",
    "pub async fn fetch_mission_logs() -> Result<Vec<String>, reqwest::Error> {\n    let response = reqwest::get(\"https://api.space.com/logs\").await?;\n    let logs = response.json::<Vec<String>>().await?;\n    Ok(logs)\n}",
    "let numbers = vec![1, 2, 3, 4, 5];\nlet doubled: Vec<i32> = numbers.iter().map(|x| x * 2).collect();\nprintln!(\"Doubled vector: {:?}\", doubled);",
    "enum RocketState {\n    PreLaunch,\n    Ignition(f64),\n    Orbit,\n    Landed,\n}"
  ],
  go: [
    "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tfmt.Println(\"Launching TypeRocket in Go!\")\n}",
    "type Rocket struct {\n\tName     string  `json:\"name\"`\n\tAltitude float64 `json:\"altitude\"`\n\tVelocity float64 `json:\"velocity\"`\n}\n\nfunc (r *Rocket) Ascend(kms float64) {\n\tr.Altitude += kms\n}",
    "func fetchTelemetry(ch chan<- string) {\n\ttime.Sleep(100 * time.Millisecond)\n\tch <- \"Telemetry OK\"\n}",
    "func processItems(items []string) map[string]int {\n\tresult := make(map[string]int)\n\tfor _, item := range items {\n\t\tresult[item]++\n\t}\n\treturn result\n}",
    "if err := rocket.Launch(); err != nil {\n\tlog.Fatalf(\"Failed to launch rocket: %v\", err)\n}"
  ],
  html: [
    "<div className=\"rocket-container\">\n  <header className=\"hero-header\">\n    <h1>TypeRocket Control</h1>\n    <p>Prepare for launch across the atmosphere!</p>\n  </header>\n</div>",
    "<section className=\"hud-dashboard\">\n  <div className=\"stat-card\">\n    <span className=\"label\">Speed</span>\n    <strong className=\"value\">120 WPM</strong>\n  </div>\n</section>",
    "<nav className=\"space-nav\">\n  <ul className=\"nav-links\">\n    <li><a href=\"#launch\">Launch</a></li>\n    <li><a href=\"#telemetry\">Telemetry</a></li>\n  </ul>\n</nav>",
    "<form onSubmit={handleLaunch}>\n  <label htmlFor=\"rocket-name\">Rocket ID</label>\n  <input type=\"text\" id=\"rocket-name\" required placeholder=\"Falcon Heavy\" />\n  <button type=\"submit\">Engage</button>\n</form>",
    "<canvas id=\"orbitCanvas\" width=\"800\" height=\"600\" style={{ border: '2px solid white' }}></canvas>"
  ],
  sql: [
    "SELECT rocket_name, MAX(altitude_km) AS max_altitude, AVG(wpm) AS avg_wpm\nFROM flight_logs\nWHERE flight_date >= '2026-01-01'\nGROUP BY rocket_name\nHAVING MAX(altitude_km) > 1000\nORDER BY max_altitude DESC;",
    "INSERT INTO flight_telemetry (rocket_id, altitude_km, velocity_ms, timestamp)\nVALUES ('apollo-11', 384400, 10834, NOW());",
    "CREATE TABLE IF NOT EXISTS space_missions (\n  id SERIAL PRIMARY KEY,\n  mission_name VARCHAR(100) NOT NULL,\n  launch_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  success BOOLEAN DEFAULT TRUE\n);",
    "UPDATE rocket_fleet\nSET status = 'orbit',\n    altitude_km = altitude_km + 500\nWHERE rocket_id = 'falcon-9' AND status = 'in-flight';",
    "SELECT p.planet_name, p.distance_from_sun_au, m.mission_count\nFROM planets p\nLEFT JOIN missions m ON p.id = m.target_planet_id\nWHERE p.has_atmosphere = TRUE;"
  ]
};
