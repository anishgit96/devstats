package com.springgithub.springgithub.services.github;

import com.springgithub.springgithub.data.GithubData;
import com.springgithub.springgithub.model.User;
import com.springgithub.springgithub.repositories.GithubRepository;
import org.bson.types.ObjectId;
import org.eclipse.egit.github.core.client.GitHubClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.convert.DbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultDbRefResolver;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.stereotype.Service;

@EnableMongoRepositories(basePackageClasses = GithubRepository.class)
@Service
public class GithubDBUtility {

    @Autowired
    CustomGithubService customGithubService;

    @Autowired
    GithubRepository githubRepository;

    public GithubDBUtility() { }

    public void insertData(String username) {

        GithubData githubData = new GithubData(ObjectId.get());

        if(customGithubService.getUser(username).getLogin() != null) {
            githubData.setUsername(customGithubService.getUser(username).getLogin().toLowerCase());
            githubData.setUser(customGithubService.getUser(username));
            githubData.setCommits(this.customGithubService.getCommitsAdaptorRe(username));
            githubRepository.save(githubData);
        }

    }

    public GithubData getUserDB(String username) {

        // Find the user from the db.
        GithubData githubData = githubRepository.findByUsername(username);

        // If the user is not found, send a response with null user attributes.
        if(githubData == null) {
            githubData = new GithubData(ObjectId.get());
            User user = new User();
            user.setValidated(false);
            user.setLogin(null);
            user.setAvatar_url(null);
            user.setBio(null);
            user.setBlog(null);
            user.setCompany(null);
            user.setCreated_at(null);
            user.setEmail(null);
            user.setFollowers(null);
            user.setFollowing(null);
            githubData.setCommits(null);
            githubData.setUser(user);
        }

        return githubData;
    }

}
