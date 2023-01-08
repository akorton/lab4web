package ifmo.labs.lab4.controllers;

import ifmo.labs.lab4.api.User;
import ifmo.labs.lab4.api.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class AuthController {

    private final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final UserRepository userRepository;

    @Autowired
    public AuthController(UserRepository userRepository){
        this.userRepository = userRepository;
    }

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
        Optional<User> possibleUser = userRepository.findById(name);
        if (possibleUser.isEmpty()) return false;
        User user = possibleUser.get();
        return user.getPassword().equals(passwd);
    }

    private boolean addUser(String name, String passwd){
        if (!checkPassword(passwd) || !checkUsername(name)) return false;
        if (userRepository.findById(name).isPresent()) return false;
        userRepository.save(new User(name, passwd));
        return true;
    }

    private boolean checkUsername(String name){
        return !name.isEmpty();
    }

    private boolean checkPassword(String password){
        return !password.isEmpty();
    }
}
