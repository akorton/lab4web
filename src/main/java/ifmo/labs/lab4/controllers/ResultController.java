package ifmo.labs.lab4.controllers;

import ifmo.labs.lab4.api.Result;
import ifmo.labs.lab4.api.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ResultController {

    private final ResultRepository resultRepository;

    @Autowired
    ResultController(ResultRepository resultRepository){
        this.resultRepository = resultRepository;
    }

    @RequestMapping(value = "/api/results", method = RequestMethod.GET)
    public Iterable<Result> getResults(){
        return resultRepository.findAll();
    }

    @RequestMapping(value="/api/results", method=RequestMethod.POST)
    public Result addResult(@RequestBody Result result){
        return resultRepository.save(result);
    }
}
