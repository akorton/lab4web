package ifmo.labs.lab4.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @RequestMapping(method = RequestMethod.GET, value="/api/login")
    public boolean login(@RequestParam String username, @RequestParam String password){
        boolean checkResult = checkUser(username, password);
        logger.info("User with username <%s> and password <%s>".formatted(username, password) + (checkResult ? " successfully" : "was not") +  " logged in.");
        return checkResult;
    }


    @RequestMapping(method = RequestMethod.GET, value="/api/register")
    public boolean register(@RequestParam String username, @RequestParam String password){
        boolean checkResult = addUser(username, password);
        logger.info("User with username <%s> and password <%s>".formatted(username, password) + (checkResult ? " successfully" : "was not") +  " registered.");
        return checkResult;
    }

    private boolean checkUser(String name, String passwd){
        return !name.isEmpty() && !passwd.isEmpty();
    }

    private boolean addUser(String name, String passwd){ return !name.isEmpty() && !passwd.isEmpty();}
}
