using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace QuizService;

public class Question
{ 
    private string ExtendedData;
    public int Id {get; set;}
    public int Type {get; set;}
    public string Category {get; set;}
    public string Level {get; set;}
    public string Title {get; set;}
    public string Summary {get; set;}
    //public string StrData {get; set;}
    [NotMapped]
    public JObject Data
    {
        get
        {
            return JsonConvert.DeserializeObject<JObject>(string.IsNullOrEmpty(ExtendedData) ? "{}" : ExtendedData);
        }
        set
        {
            ExtendedData = value.ToString();
        }
    }
    public List<QuizQuestion> QuizQuestions { get; set; } = new();

}
