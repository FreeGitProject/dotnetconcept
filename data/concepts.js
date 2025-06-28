export const concepts = [
  {
    topicID: 1,
    title: "Dependency Injection",
    definition: "A design pattern that implements Inversion of Control for resolving dependencies.",
    detailedExplanation: "Dependency Injection (DI) is a technique where an object receives other objects that it depends on, rather than creating them internally. This promotes loose coupling and makes code more testable and maintainable.",
    whenToUse: "Use DI when you want to decouple classes from their dependencies, improve testability, and follow SOLID principles.",
    whyNeed: "DI makes your code more flexible, testable, and maintainable by reducing tight coupling between components.",
    codeExample: `public interface IEmailService
{
    void SendEmail(string message);
}

public class EmailService : IEmailService
{
    public void SendEmail(string message)
    {
        // Send email logic
    }
}

public class UserController
{
    private readonly IEmailService _emailService;
    
    public UserController(IEmailService emailService)
    {
        _emailService = emailService;
    }
    
    public void RegisterUser(User user)
    {
        // Registration logic
        _emailService.SendEmail("Welcome!");
    }
}`,
    keyword: "DI, IoC, Inversion of Control, Services"
  },
  {
    topicID: 2,
    title: "SOLID Principles",
    definition: "Five design principles intended to make software designs more understandable, flexible, and maintainable.",
    detailedExplanation: "SOLID is an acronym for five design principles: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. These principles help create more robust and maintainable code.",
    whenToUse: "Apply SOLID principles during the design phase and when refactoring existing code to improve its structure.",
    whyNeed: "Following SOLID principles leads to code that is easier to understand, test, maintain, and extend.",
    codeExample: `// Single Responsibility Principle
public class User
{
    public string Name { get; set; }
    public string Email { get; set; }
}

public class UserValidator
{
    public bool IsValid(User user)
    {
        return !string.IsNullOrEmpty(user.Name) && 
               !string.IsNullOrEmpty(user.Email);
    }
}

public class UserRepository
{
    public void Save(User user)
    {
        // Save user to database
    }
}`,
    keyword: "SRP, OCP, LSP, ISP, DIP, Design Principles"
  },
  {
    topicID: 3,
    title: "Async/Await",
    definition: "Keywords used to write asynchronous code that doesn't block the calling thread.",
    detailedExplanation: "The async and await keywords enable you to write asynchronous code that looks and behaves like synchronous code, making it easier to work with long-running operations without blocking the UI or other threads.",
    whenToUse: "Use async/await for I/O operations, web requests, file operations, and any long-running tasks that shouldn't block the main thread.",
    whyNeed: "Async/await improves application responsiveness and scalability by allowing other work to continue while waiting for operations to complete.",
    codeExample: `public async Task<string> GetUserDataAsync(int userId)
{
    using (var httpClient = new HttpClient())
    {
        var response = await httpClient.GetAsync($"api/users/{userId}");
        return await response.Content.ReadAsStringAsync();
    }
}

public async Task ProcessUserAsync()
{
    try
    {
        var userData = await GetUserDataAsync(123);
        Console.WriteLine(userData);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }
}`,
    keyword: "Asynchronous, Task, Threading, Non-blocking"
  },
  {
    topicID: 4,
    title: "LINQ",
    definition: "Language Integrated Query - a set of features that extends query capabilities to the C# language syntax.",
    detailedExplanation: "LINQ provides a consistent model for working with data across various kinds of data sources and formats. It integrates query expressions based on similar patterns across relational databases, XML documents, and in-memory data structures.",
    whenToUse: "Use LINQ when you need to query, filter, transform, or manipulate collections of data in a declarative way.",
    whyNeed: "LINQ makes data querying more readable, type-safe, and reduces the amount of boilerplate code needed for common data operations.",
    codeExample: `var numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Query syntax
var evenNumbers = from n in numbers
                  where n % 2 == 0
                  select n;

// Method syntax
var evenSquares = numbers
    .Where(n => n % 2 == 0)
    .Select(n => n * n)
    .ToList();

// Complex example with objects
var users = GetUsers();
var activeAdultUsers = users
    .Where(u => u.IsActive && u.Age >= 18)
    .OrderBy(u => u.Name)
    .Select(u => new { u.Name, u.Email })
    .ToList();`,
    keyword: "Query, Lambda, Enumerable, IQueryable"
  },
  {
    topicID: 5,
    title: "Entity Framework Core",
    definition: "A modern object-database mapper for .NET that supports LINQ queries, change tracking, updates, and schema migrations.",
    detailedExplanation: "Entity Framework Core (EF Core) is a lightweight, extensible, and cross-platform version of Entity Framework data access technology. It serves as an object-relational mapper (O/RM) enabling .NET developers to work with databases using .NET objects.",
    whenToUse: "Use EF Core when you need to interact with databases in .NET applications and want to work with strongly-typed objects instead of writing raw SQL.",
    whyNeed: "EF Core simplifies data access by eliminating much of the data-access code that developers usually need to write, and provides features like migrations, lazy loading, and change tracking.",
    codeExample: `public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public List<Order> Orders { get; set; }
}

public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(connectionString);
    }
}

// Usage
using (var context = new AppDbContext())
{
    var user = await context.Users
        .Include(u => u.Orders)
        .FirstOrDefaultAsync(u => u.Id == 1);
}`,
    keyword: "ORM, Database, DbContext, Migrations"
  },
  {
    topicID: 6,
    title: "Middleware in ASP.NET Core",
    definition: "Software components that are assembled into an application pipeline to handle requests and responses.",
    detailedExplanation: "Middleware in ASP.NET Core forms a pipeline where each component can perform operations before and after the next component in the pipeline. Each middleware component chooses whether to pass the request to the next component and can perform work before and after the next component is invoked.",
    whenToUse: "Use middleware for cross-cutting concerns like authentication, logging, error handling, and request/response modification that should apply to multiple routes.",
    whyNeed: "Middleware provides a clean way to handle common functionality across your application without duplicating code in every controller or action.",
    codeExample: `public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        _logger.LogInformation($"Request: {context.Request.Method} {context.Request.Path}");
        
        await _next(context);
        
        _logger.LogInformation($"Response: {context.Response.StatusCode}");
    }
}

// In Startup.cs or Program.cs
app.UseMiddleware<RequestLoggingMiddleware>();`,
    keyword: "Pipeline, Request, Response, ASP.NET Core"
  }
];